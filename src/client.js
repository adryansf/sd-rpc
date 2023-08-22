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
var argv = parseArgs(process.argv.slice(2), {
  string: "target",
});
const target = argv.target || "localhost:50051";

var client = new proto.MMCCalculator(target, grpc.credentials.createInsecure());

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function run() {
  let a, b;
  a = await terminal.question(`Digite um número: `);
  b = await terminal.question(`Digite outro número: `);
  client.calculateMMC({ a, b }, function (error, response) {
    if (error) console.error("Erro no Servidor: ", error.message);
    console.log(`MMC: ${response.mmc}`);
    process.exit();
  });
}

run();
