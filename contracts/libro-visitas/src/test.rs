#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation, Events as _},
    Address, Env, Event, IntoVal, String, Symbol,
};

fn crear(env: &Env) -> LibroVisitasClient<'_> {
    let id = env.register(LibroVisitas, ());
    LibroVisitasClient::new(env, &id)
}

#[test]
fn firmar_y_listar() {
    let env = Env::default();
    env.mock_all_auths();
    let libro = crear(&env);
    let ana = Address::generate(&env);
    let beto = Address::generate(&env);

    assert_eq!(libro.total(), 0);
    assert_eq!(libro.listar().len(), 0);

    let m1 = String::from_str(&env, "La primera ronda va por la casa.");
    let m2 = String::from_str(&env, "¡Salud desde Costa Rica!");
    assert_eq!(libro.firmar(&ana, &m1), 1);
    assert_eq!(libro.firmar(&beto, &m2), 2);

    let firmas = libro.listar();
    assert_eq!(firmas.len(), 2);
    assert_eq!(firmas.get(0).unwrap().autor, ana);
    assert_eq!(firmas.get(0).unwrap().mensaje, m1);
    assert_eq!(firmas.get(1).unwrap().autor, beto);
    assert_eq!(firmas.get(1).unwrap().mensaje, m2);
    assert_eq!(libro.total(), 2);
    assert!(libro.ya_firmo(&ana));
    assert!(!libro.ya_firmo(&Address::generate(&env)));
}

#[test]
fn firmar_exige_autorizacion_del_autor() {
    let env = Env::default();
    env.mock_all_auths();
    let libro = crear(&env);
    let ana = Address::generate(&env);
    let mensaje = String::from_str(&env, "Hola cantina");

    libro.firmar(&ana, &mensaje);

    assert_eq!(
        env.auths(),
        std::vec![(
            ana.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    libro.address.clone(),
                    Symbol::new(&env, "firmar"),
                    (ana.clone(), mensaje.clone()).into_val(&env),
                )),
                sub_invocations: std::vec![],
            }
        )]
    );
}

#[test]
#[should_panic]
fn sin_autorizacion_falla() {
    let env = Env::default();
    let libro = crear(&env);
    let ana = Address::generate(&env);
    libro.firmar(&ana, &String::from_str(&env, "Intento sin firma"));
}

#[test]
fn una_sola_firma_por_direccion() {
    let env = Env::default();
    env.mock_all_auths();
    let libro = crear(&env);
    let ana = Address::generate(&env);

    libro.firmar(&ana, &String::from_str(&env, "Primera"));
    let otra = libro.try_firmar(&ana, &String::from_str(&env, "Segunda"));
    assert_eq!(otra, Err(Ok(Error::YaFirmo)));
    assert_eq!(libro.total(), 1);
}

#[test]
fn rechaza_mensaje_vacio_o_largo() {
    let env = Env::default();
    env.mock_all_auths();
    let libro = crear(&env);
    let ana = Address::generate(&env);

    let vacio = libro.try_firmar(&ana, &String::from_str(&env, ""));
    assert_eq!(vacio, Err(Ok(Error::MensajeVacio)));

    let largo = "x".repeat(MAX_BYTES as usize + 1);
    let largo = libro.try_firmar(&ana, &String::from_str(&env, &largo));
    assert_eq!(largo, Err(Ok(Error::MensajeLargo)));

    // Tras los errores todavía puede firmar.
    assert_eq!(libro.firmar(&ana, &String::from_str(&env, "Ahora sí")), 1);
}

#[test]
fn emite_evento_al_firmar() {
    let env = Env::default();
    env.mock_all_auths();
    let libro = crear(&env);
    let ana = Address::generate(&env);
    let mensaje = String::from_str(&env, "Brindis");

    libro.firmar(&ana, &mensaje);

    assert_eq!(
        env.events().all(),
        std::vec![FirmaEvento {
            autor: ana.clone(),
            mensaje: mensaje.clone(),
        }
        .to_xdr(&env, &libro.address)]
    );
}
