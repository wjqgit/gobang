import * as THREE from 'three'
import Stats from 'stats.js'
import { Animator } from './bothive3'

window.THREE = THREE
window.Stats = Stats

import React from 'react'
import ReactDOM from 'react-dom'

import Panel from './components/Panel'
import Store from './Store'

const app = document.getElementById('app')

ReactDOM.render(<Panel store={Store}/>, app)
