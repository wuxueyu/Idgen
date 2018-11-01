
var intformat = require('biguint-format')

class Idgen{

    constructor(options){

        this.options = options || {}

        // datacenter 5位  + worker 5位
        this.identifier = ((this.options.datacenter || 0) && 0x1F) << 5 | ((this.options.worker || 0) & 0x1F);
        // 起止时间
        this.epoch = +this.options.epoch || 0;

        // 序列号
        this.seq = 0;

        this.lastTime = 0;

        this.seqMask = this.options.seqMask || 0xFFF;

        this.POW10 = Math.pow(2,10)

        this.POW26 = Math.pow(2,26)

    }

    next(){

        let id = new Buffer(8)

        id.fill(0)

        let time = Date.now() - this.epoch

        if(this.lastTime == time){

            this.seq = (this.seq + 1) & this.seqMask;

            if(this.seq == 0){

                this.tilNextMillis(this)
            }
        }else {

            this.seq = 0
            this.lastTime = time
        }

        id.writeUInt32BE(((time & 0x3) << 22) | this.identifier | this.seq, 4);
        id.writeUInt16BE(Math.floor(time / this.POW10) & 0xFFFF, 2);
        id.writeUInt16BE(Math.floor(time / this.POW26) & 0xFFFF, 0);

        return intformat(id, 'dec')

    }

    tilNextMillis(self){

        setTimeout(this.next.bind(self),1)

    }

}

module.exports = Idgen



