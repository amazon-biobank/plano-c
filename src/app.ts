import { initServer } from "./payment-service/restIndex";


const retryInitServer = () => {
  try{
    initServer();
  }
  catch{
    retryInitServer();
  }
}

retryInitServer();