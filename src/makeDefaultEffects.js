import {
  ACTION,
  FRAME,
  DELAY,
  TIME,
  LOG,
  HTTP,
  EVENT,
  KEY_DOWN,
  KEY_UP,
  RANDOM
} from "./effectTypes"
import { assign, omit } from "./utils.js"

export default function makeDefaultEffects() {
  var effects = {}

  effects[ACTION] = function(props, getAction) {
    getAction(props.name)(props.data)
  }

  effects[FRAME] = function(props, getAction) {
    requestAnimationFrame(function(time) {
      getAction(props.action)(time)
    })
  }

  effects[DELAY] = function(props, getAction) {
    setTimeout(function() {
      getAction(props.action)(props.data)
    }, props.duration)
  }

  effects[TIME] = function(props, getAction) {
    getAction(props.action)(performance.now())
  }

  effects[LOG] = function(props, getAction) {
    console.log.apply(null, props.args)
  }

  effects[HTTP] = function(props, getAction) {
    var options = assign(
      {
        response: "json",
        error: props.action
      },
      props.options
    )
    var fetchOptions = omit(options, ["response", "error"])
    fetch(props.url, fetchOptions)
      .then(function(response) {
        if (!response.ok) {
          throw response
        }
        return response
      })
      .then(function(response) {
        return response[options.response]()
      })
      .then(function(result) {
        getAction(props.action)(result)
      })
      .catch(function(error) {
        getAction(options.error)(error)
      })
  }

  effects[EVENT] = function(props, getAction) {
    getAction(props.action)(props.event)
  }

  effects[KEY_DOWN] = function(props, getAction) {
    document.onkeydown = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  effects[KEY_UP] = function(props, getAction) {
    document.onkeyup = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  effects[RANDOM] = function(props, getAction) {
    var randomValue = Math.random() * (props.max - props.min) + props.min
    getAction(props.action)(randomValue)
  }

  return effects
}
