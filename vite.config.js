import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({

plugins:[
react(),
tailwindcss()
],


build:{

rollupOptions:{

output:{

entryFileNames:"content.js",

chunkFileNames:"chunks/[name].js",

assetFileNames:(assetInfo)=>{

if(assetInfo.name.endsWith(".css")){

return "style.css";

}

return "assets/[name][extname]";

}

}

}

}

})