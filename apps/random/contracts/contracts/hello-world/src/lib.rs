#![no_std]
use core::panic;

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Bytes, Env};

#[contracttype]
pub enum DataKey {
    PRNG,
    OracleRandomNumber,
    OracleTimestamp,
}

#[contract]
pub struct RandomContract;

#[contractimpl]
impl RandomContract {
    pub fn set_random(env: Env, random_bytes: Bytes, timestamp: u64) {
        if random_bytes.len() != 8 {
            panic!("Invalid bytes array length");
        }
        let mut array = [0u8; 8];
        for i in 0..8 {
            array[i] = random_bytes.get(i as u32).unwrap();
        }
        let rand = u64::from_be_bytes(array); //  big-endian
        env.storage()
            .persistent()
            .set(&DataKey::OracleRandomNumber, &rand);
        env.storage()
            .persistent()
            .set(&DataKey::OracleTimestamp, &timestamp);
        env.events()
            .publish((symbol_short!("random"),), (random_bytes, timestamp));
    }

    pub fn get_random(env: Env) -> (u64, u64) {
        let random_number: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::OracleRandomNumber)
            .unwrap_or(0);
        let timestamp: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::OracleTimestamp)
            .unwrap_or(0);
        (random_number, timestamp)
    }

    pub fn generate_prng(env: Env) -> u64 {
        let key: DataKey = DataKey::PRNG;
        let prng: u64 = env.prng().gen();
        env.storage().persistent().set(&key, &prng);
        prng
    }

    pub fn get_prng(env: Env) -> u64 {
        env.storage().persistent().get(&DataKey::PRNG).unwrap_or(0)
    }
}
