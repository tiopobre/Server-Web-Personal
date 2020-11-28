const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;

const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

//mongoose.connect( `mongodb://localhost:27017/daneilalejandroserrano` );
//conexion de server a basse de datos
mongoose.set("useFindAndModify", false);
mongoose.connect(
  `mongodb+srv://Daniel:daniel1234@webpersonalcurso.ra4ql.mongodb.net/WebPersonalCursoDB?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("la conexiona a la BD es correcta");
      app.listen(port, () => {
        console.log("############################");
        console.log("########## API REST #########");
        console.log("#############################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);

