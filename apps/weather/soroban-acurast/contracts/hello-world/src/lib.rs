#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WeatherData {
    pub temperature: i32,
    pub description: String,
    pub timestamp: u64,
}

const WEATHER_KEY: Symbol = symbol_short!("WEATHER");

#[contract]
pub struct WeatherContract;

#[contractimpl]
impl WeatherContract {
    pub fn set_weather(env: Env, temperature: i32, description: String) {
        let weather_data = WeatherData {
            temperature,
            description,
            timestamp: env.ledger().timestamp(),
        };
        // Store the weather data in instance storage
        env.storage().instance().set(&WEATHER_KEY, &weather_data);
    }

    pub fn get_weather(env: Env) -> Option<WeatherData> {
        // Retrieve the latest saved weather data from instance storage
        env.storage().instance().get(&WEATHER_KEY)
    }
}
