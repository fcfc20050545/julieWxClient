import { createApp } from 'vue'
import { initCloud } from './services/cloud'
import './app.scss'

const App = createApp({
  onLaunch() {
    initCloud()
  },
  onShow() {}
})

export default App
