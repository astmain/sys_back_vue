export const AjaxResult = {
    ok: function (msg, arg) {
        return {...arg, msg: msg, err: "", code: 200,}
    },
    err: function (msg, err) {
        return {msg: msg, err: err, code: 400,}
    },
   
}

