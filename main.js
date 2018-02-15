var input = document.querySelector('#input textarea')
var output = document.querySelector('#output pre')
var tips = document.querySelectorAll('section p')
var fixit = document.querySelector('#fixit')
var actionTypes = {}

var actions = document.querySelectorAll('header button')
var currentType

function resetBtns() {
  actions.forEach(function (a) {
    a.className = ''
  })
}

function resetTips() {
  tips.forEach(function (t) {
    t.className = ''
  })
}

actions.forEach(function (a) {
  actionTypes[a.id] = true
  a.onclick = function (ev) {
    ev.preventDefault()
    currentType = this.id
    resetBtns()
    resetTips()
    this.className = 'on'
    document.querySelector('#' + this.id + '-tips').className = 'on'
  }
})

currentType = Object.keys(actionTypes)[0]
actions[0].click()

fixit.onclick = function (ev) {
  ev.preventDefault()
  output.textContent = format()
}

function fixTypes(parsed) {
  console.log('parsed ', parsed)
  Object.keys(parsed).map(function (p) {
    // check int
    var int = parseInt(parsed[p], 10)
    if (!isNaN(int)) {
      parsed[p] = int

    // check bool
    } else if (parsed[p] == 'true' || parsed[p] == 'false') {
      parsed[p] = !!parsed[p]
    }
  })

  return parsed
}

function formatJSON() {
  var parsed

  try {
    console.log(input.value)
    var preformat = input.value.replace(/([a-zA-Z0-9-_']+):\s*([a-zA-Z0-9-_']+)/g, '\"$1\":\"$2\"')
                               .replace(/"'|'"/g, '"')
    parsed = JSON.parse(preformat)
    parsed = fixTypes(parsed)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return 'INVALID JSON'
  }
}

function formatBase64Encode() {
  return btoa(input.value)
}

function formatBase64Decode() {
  return atob(input.value)
}

function escapeHTMLString() {
  var data = input.value

  data = data.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g, '&quot;')
  return data.toString()
}

function unescapeHTMLString() {
  var data = input.value

  data = data.replace(/\&amp;/g,'&')
            .replace(/\&lt;/g,'<')
            .replace(/\&gt;/g,'>')
            .replace(/\&quot;/g, '"')
  return data
}

function format() {
  input = document.querySelector('#input textarea')

  if (actionTypes.hasOwnProperty(currentType)) {
    return window[currentType]()
  }

  return false
}
