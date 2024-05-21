import basicSsl from "@vitejs/plugin-basic-ssl";
import { Server } from "http";

export default {
  plugins: [basicSsl()],
  Server: {
    https: true,
  },
};
