// Bibliotecas
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const calculateMMC = require("./utils/calculateMMC");

// Importar o Proto
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, "mmc.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const proto = grpc.loadPackageDefinition(packageDefinition).mmc;

// Instanciar Servidor
const server = new grpc.Server();

// Adicionar serviço de calcular MMC
server.addService(proto.MMCCalculator.service, {
  calculateMMC: function (call, callback) {
    // Medir tempo de execução e chamar a função
    const startTime = Date.now();
    const mmc = calculateMMC(call.request.a, call.request.b);
    const duration = Date.now() - startTime;

    console.log(
      `Cliente: ${call.getPeer()} - Tempo de processamento: ${duration} ms`
    );

    // Retornar o MMC
    callback(null, { mmc });
  },
});

// Configurar porta e iniciar o servidor
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`Servidor Iniciado na porta 50051`);
  }
);
