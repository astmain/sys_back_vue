export const R = {
    ok: function ({msg, result}) {
        return {code: 200, kind: "ok", msg: msg, result: result,}
    },
    err: function ({msg, result}) {
        return {code: 400, kind: "err", msg: msg, result: result,}
    },
    wrapper_response: function (promise, msg) {
        return promise.then(result => this.ok({msg: msg, result: result}))
            .catch(err => this.err({msg: err.msg, result: err}))
    }
}

