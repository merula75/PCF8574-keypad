"""

Provides access to keypad

"""
# % color=#2A7EFF weight=100 icon="\uf11c" block="keypad"
@namespace
class keypad:
    # % block
    def initialize_keypad(addr: number, keys: str):
        pass
    # % block
    def wihch_key():
        global temp, val, last
        for row in range(5):
            temp = 255 - 2 ** (7 - row)
            pins.i2c_write_number(32, temp, NumberFormat.UINT8_LE, False)
            val = pins.i2c_read_number(32, NumberFormat.UINT8_LE, False)
            if temp != val:
                if val != last:
                    serial.write_line("Zeile " + ("" + str(row)) + " Spalte " + ("" + str(val)))
                last = val
    val = 0
    temp = 0
    last = 0
    last = 0
    
    def on_forever():
        wihch_key()
        control.wait_micros(1000)
    basic.forever(on_forever)
    