const stdio = require("./stdio");

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"];

class Keypress
{
    constructor(key, velocity, keys_array)
    {
        this.key = key;
        this.velocity = velocity;
        this.keys_array = keys_array;

        this.keys_array.push(this);
    }

    get note()
    {
        return notes[this.key % 12]
    }

    destroy()
    {
        this.keys_array.splice(this.keys_array.indexOf(this), 1);
    }
}

class Piano
{
    constructor()
    {
        this.pressed_keys = [];
        this._update = () => {};

        this.initialize();
    }

    set update(method)
    {
        this._update = method;
    }

    get update()
    {
        return this._update;
    }

    initialize()
    {
        let context = this;
        stdio.stdin.key_on_handler = function(data)
        {
            new Keypress(data.key, data.velocity, context.pressed_keys);
            context.update(context.pressed_keys);
        }

        stdio.stdin.key_off_handler = function(data)
        {
            for (let key of context.pressed_keys)
            {
                if (key.key == data.key)
                {
                    key.destroy();
                }
            }

            context.update(context.pressed_keys);
        }
    }
}

let piano = new Piano();
module.exports.piano = piano;
