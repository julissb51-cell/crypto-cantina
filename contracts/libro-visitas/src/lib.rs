#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, Address, Env, String, Vec,
};

#[cfg(test)]
mod test;

/// Largo máximo del mensaje en bytes (80 caracteres de hasta 4 bytes en UTF-8).
pub const MAX_BYTES: u32 = 320;

// Alrededor de 30 días de ledgers (~5 s cada uno) para mantener vivo el libro.
const TTL_UMBRAL: u32 = 17_280 * 15;
const TTL_EXTENDER: u32 = 17_280 * 30;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// Esta dirección ya firmó el libro.
    YaFirmo = 1,
    /// El mensaje está vacío.
    MensajeVacio = 2,
    /// El mensaje supera el largo máximo.
    MensajeLargo = 3,
}

/// Una firma del libro de visitas.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Firma {
    pub autor: Address,
    pub mensaje: String,
    pub ledger: u32,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
enum Clave {
    /// Cantidad total de firmas.
    Total,
    /// Firma número `n` (empieza en 0).
    Firma(u32),
    /// Marca que una dirección ya firmó.
    Firmo(Address),
}

/// Evento emitido cada vez que alguien firma el libro.
#[contractevent(topics = ["firma"], data_format = "single-value")]
pub struct FirmaEvento {
    #[topic]
    pub autor: Address,
    pub mensaje: String,
}

#[contract]
pub struct LibroVisitas;

#[contractimpl]
impl LibroVisitas {
    /// Firma el libro. El autor debe aprobar la transacción con su billetera.
    /// Devuelve el número de firma (empezando en 1).
    pub fn firmar(env: Env, autor: Address, mensaje: String) -> Result<u32, Error> {
        autor.require_auth();

        let largo = mensaje.len();
        if largo == 0 {
            return Err(Error::MensajeVacio);
        }
        if largo > MAX_BYTES {
            return Err(Error::MensajeLargo);
        }

        let persistente = env.storage().persistent();
        let marca = Clave::Firmo(autor.clone());
        if persistente.has(&marca) {
            return Err(Error::YaFirmo);
        }

        let total = Self::total(env.clone());
        let firma = Firma {
            autor: autor.clone(),
            mensaje: mensaje.clone(),
            ledger: env.ledger().sequence(),
            timestamp: env.ledger().timestamp(),
        };

        let clave = Clave::Firma(total);
        persistente.set(&clave, &firma);
        persistente.extend_ttl(&clave, TTL_UMBRAL, TTL_EXTENDER);
        persistente.set(&marca, &total);
        persistente.extend_ttl(&marca, TTL_UMBRAL, TTL_EXTENDER);

        let instancia = env.storage().instance();
        instancia.set(&Clave::Total, &(total + 1));
        instancia.extend_ttl(TTL_UMBRAL, TTL_EXTENDER);

        FirmaEvento { autor, mensaje }.publish(&env);

        Ok(total + 1)
    }

    /// Devuelve todas las firmas, de la más antigua a la más reciente.
    pub fn listar(env: Env) -> Vec<Firma> {
        let total = Self::total(env.clone());
        let persistente = env.storage().persistent();
        let mut firmas = Vec::new(&env);
        for i in 0..total {
            if let Some(firma) = persistente.get::<_, Firma>(&Clave::Firma(i)) {
                firmas.push_back(firma);
            }
        }
        firmas
    }

    /// Cantidad de firmas en el libro.
    pub fn total(env: Env) -> u32 {
        env.storage().instance().get(&Clave::Total).unwrap_or(0)
    }

    /// Indica si una dirección ya firmó.
    pub fn ya_firmo(env: Env, autor: Address) -> bool {
        env.storage().persistent().has(&Clave::Firmo(autor))
    }
}
