import { secretKey } from "@src/config/crypto";
import { CryptoService } from "@src/interfaces/crypto-service";
import CryptoJS from "crypto-js";

class CryptoJSCryptoService implements CryptoService {
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }
}

export default CryptoJSCryptoService;
