#!/bin/zsh

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  printf 'Necesitas instalar Node.js para iniciar esta aplicación.\n'
  read -r '?Pulsa Enter para cerrar...'
  exit 1
fi

if [[ ! -x node_modules/.bin/ng ]]; then
  printf 'Instalando dependencias del proyecto...\n'
  npm install || {
    printf 'No se pudieron instalar las dependencias.\n'
    read -r '?Pulsa Enter para cerrar...'
    exit 1
  }
fi

npm start -- --open