import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const port = process.env.port || process.env.npm_config_port || 9528 // dev port
export default defineConfig(({ command }) => {
  console.log(command)
  return {
    base: '/',
    plugins: [
      vue()
    ],
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@img': resolve('./src/assets/img')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/variables.scss"as *;`
          // additionalData: `@use "@/styles/variables.scss";`
        }
      }
    },
    server: {
      port: port,
      open: true,
      overlay: {
        warnings: false,
        errors: true
      },
      proxy: {
        '/api/auth': {
          target: 'http://36.153.113.2:31824/',
          changeOrigin: true
          // ws: true
          // rewrite: (path) => path.replace(new RegExp('^/api'), '')
        },
        '/api/gov': {
          target: 'http://192.168.20.12:30898/',
          changeOrigin: true
        }
      }
    },
    build: {
      // sourcemap: true,
      manifest: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'vuex'],
            'element-plus': ['element-plus']
          }
        }
      },
      chunkSizeWarningLimit: 500
    }
  }
})
