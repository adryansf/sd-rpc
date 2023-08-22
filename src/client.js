// Bibliotecas
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const readline = require("readline/promises");
const { parseArgs } = require("util");

// Importar o Proto
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "mmc.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const proto = grpc.loadPackageDefinition(packageDefinition).mmc;

// Endereço passado por argumento
const target = String(process.argv.slice(2)) || "localhost:50051";

// Instanciar Cliente
var client = new proto.MMCCalculator(target, grpc.credentials.createInsecure());

// Criar Interface de terminal
const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função Principal
async function run() {
  let a, b;
  // Número 1
  a = await terminal.question(`Digite um número: `);
  // Número 2
  b = await terminal.question(`Digite outro número: `);

  // Chamada RPC
  client.calculateMMC({ a, b }, function (error, response) {
    if (error) console.error("Erro no Servidor: ", error.message);
    console.log(`MMC: ${response.mmc}`);
    process.exit();
  });
}

// Chamada da função principal
run();
