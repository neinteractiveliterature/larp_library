# frozen_string_literal: true
# rubocop:disable Layout/LineLength
# Be sure to restart your server when you modify this file.

# Your secret key for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!
# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
LarpLibrary::Application.config.secret_key_base =
  ENV["SECRET_KEY_BASE"] ||
    "a3c6c10cc6c1d4993c6fc73de2763cba4e7700e75f69ce0c7343bbc646ce541f1848382c1fb38d84f24c483e631d499bddc91c6a7a71beeda06b650df40af4c1"
# rubocop:enable Layout/LineLength
