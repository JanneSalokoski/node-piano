const readline = require("readline");

class Stdin
{
    constructor()
    {
        this.interface = readline.createInterface({
            input:      process.stdin,
            output:     process.stdout,
            terminal:   false
        });

        this._key_on_handler = () => {};
        this._key_off_handler = () => {};

        this.listen();  // Not sure if this should be here...
    }

    set key_on_handler(handler)
    {
        this._key_on_handler = handler;
    }

    set key_off_handler(handler)
    {
        this._key_off_handler = handler;
    }

    get key_on_handler()
    {
        return this._key_on_handler;
    }

    get key_off_handler()
    {
        return this._key_off_handler;
    }

    parse (line)
    {
        let pattern = /^.+?Note (\w+?)\s.+?.+?note (\d{2}).+?velocity (\d+)$|^.+?Note (\w+?)\s.+?.+?note (\d{2}).*$/;

        let result = line.match(pattern);

        if (result !== null && result.length >= 1)
        {
            let data = {};
            if (result[1] !== undefined)
            {
                data = {
                    "key": result[2],
                    "velocity": result[3]
                };

                //console.log(`Note ${result[2]} on, velocity: ${result[3]}`);

                this.key_on_handler(data);
            }
            else if (result[4] !== undefined)
            {
                data = {
                    "key": result[5]
                };

                //console.log(`Note ${result[5]} off`);

                this.key_off_handler(data);
            }
            else
            {
                throw new Error("Unexpected error!");
            }
        }

        //console.log(result);
    }

    listen ()
    {
        let context = this;
        this.interface.on("line", (line) => {
            context.parse(line);
        });
    }
}

let stdin = new Stdin();
module.exports.stdin = stdin;
