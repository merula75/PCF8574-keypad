/**
 * Provides access to keypad
 */
//% color=#2A7EFF weight=100 icon="\uf11c" block="keypad"
namespace keypad {
    export let lastKey = "";
    let initialized = false;
    let i2c_addr = 32;
    let keypad_rows = 1;
    let keypad_cols = 1;
    let keymap = "";
    let onReceivedKeyHandler: (pressedKey: string) => void;

    //% block="initialize keypad|addr $addr|rows $rows|keys $keys"
    //% addr.defl=32
    //% rows.defl=4
    //% keys.defl="123A456B789C*0#D"
    export function initialize_keypad(addr: number, rows: number, keys: string): void {
        i2c_addr = addr;
        keypad_rows = rows;
        keypad_cols = keys.length / rows;
        keymap = keys;
    }


    function wihch_key() {
        let temp = 0;
        let val = 0;
        let index = 0;
        let data = 0;
        let key = "";

        for (let row = 0; row < keypad_rows; row++) {
            temp = 255 - 2 ** (7 - row)
            pins.i2cWriteNumber(i2c_addr, temp, NumberFormat.UInt8LE, false)
            val = pins.i2cReadNumber(i2c_addr, NumberFormat.UInt8LE, false)
            if (temp != val) {
                data = val
                data ^= temp
                for (let col = 0; col < keypad_cols; col++) {
                    let coldata = 1 << (keypad_cols - 1 - col)
                    if (data & coldata) {
                        key = keymap[4 * row + col]
                        if (onReceivedKeyHandler) {
                            onReceivedKeyHandler(key);
                        }
                    }
                }
            }
        }

    }

    function init() {
        if (initialized) {
            return;
        }
        initialized = true;
        control.inBackground(function () {
            let i = 0;
            while (true) {
                wihch_key();
                basic.pause(50);
            }
        });
    }

    //% 
    //% blockId=keypad_on_key_pressed block="on key pressed" blockGap=16
    //% draggableParameters=reporter
    export function on_key_pressed(cb: (pressedKey: string) => void) {
        init();
        onReceivedKeyHandler = cb;
    }

}

