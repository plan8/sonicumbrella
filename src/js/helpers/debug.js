var slowLogMap = {};

module.exports = {

    slowLog: function(id, rate) {
        rate = rate || 400;
        var now = Date.now();

        if (slowLogMap[id]) {
            if (now - slowLogMap[id].ts < slowLogMap[id].rate) return;
        } else {
            slowLogMap[id] = {
                rate: rate,
                ts: now
            }
        }
        slowLogMap[id].ts = now;

        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(id);
        console.log.apply(console, args);
    },

    log: function () {
      console.log.apply( console, arguments );
    }

};
