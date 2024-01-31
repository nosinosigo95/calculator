$(document).ready(function () {

    const num_button = {
        zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", dzero: "00"
    };
    const sign = { plus: "+", minus: "-", product: "*", rate: "/" };
    let num_start_i = 0, is_dot = false, is_zero = true;

    function replace(str, i, after_char) {
        return str.substr(0, i) + after_char + str.substr(i + 1);
    };

    /*入力が要件に沿っているか */
    function parse(display_text, input_class) {
        let current = display_text.length,
            pre = current - 1;
        let is_char_num = input_class in num_button,
            is_char_sign = input_class in sign;

        /*先頭*/
        if (current === 1 && display_text[0] === "0") {
            if (input_class === "dzero")
                return display_text;
            else if (is_char_num) {
                display_text = num_button[input_class];
                return display_text;
            }
            else if (input_class === "minus") {
                display_text = "-"
                num_start_i = -1;
                return display_text;
            }
        }
        if (num_start_i !== -1) {
            if (is_char_num) {
                if (is_dot) {　                /*小数*/
                    display_text += num_button[input_class];
                    /*小数点以下に0以外の数字があるか */
                    if (is_zero && input_class !== "zero" && input_class !== "dzero")
                        is_zero = false;

                } else if (display_text[num_start_i] === "0" && input_class !== "zero" && input_class !== "dzero") {
                    /*0120, 080などの先頭の0を取る*/
                    display_text = replace(display_text, num_start_i, num_button[input_class])
                }
                else if (display_text[num_start_i] === "0" && (input_class === "zero" || input_class === "dzero")) {
                    display_text = display_text;
                }
                else {
                    display_text += num_button[input_class];
                }
            }
            else if (is_char_sign) {
                /*小数点以降0だけ続く場合、*/
                if (is_dot && is_zero) {
                    display_text = display_text.substr(0, num_start_i + 1) + sign[input_class];
                } else {
                    display_text += sign[input_class];
                }
                is_dot = false;
                num_start_i = -1;
            }
        } else {
            if (is_char_sign) {
                /*演算子が連続で入力されていない。*/
                display_text[pre] = replace(display_text, pre, num_button[input_class])
            } else if (is_char_num && input_class !== "dzero") {
                display_text += num_button[input_class];
                num_start_i = current;
            }
        }

        if (input_class === "decimal") {
            if (display_text[pre] === ".")       /*小数点が連続で入力されていない。*/
                return display_text;
            else if (num_start_i === -1) {
                display_text += "0.";
                num_start_i = current;
                is_dot = is_zero = true;
            }
            else if (num_start_i >= 0 && !is_dot) {
                display_text += ".";
                num_start_i = pre;
                is_dot = is_zero = true;
            }
        }
        return display_text;
    }

    $("button").click(function () {
        let class_name = $(this).attr("class");
        let display_text = $(".display").text();
        let pre = display_text.length - 1;
        /*ACが押されたとき、全てを初期化する*/
        if (class_name === "clear") {
            num_i = 0;
            is_dot = false;
            $(".display").text("0");
        } else if (class_name === "equal") {
            if (class_name === "equal" && (num_start_i === -1 || display_text[pre] == "."))
                display_text = display_text.substr(0, pre);
            num_start_i = 0;
            is_dot = false;
            /*イコールが押されたとき、計算する*/
            let result = eval(display_text);
            $(".display").text(result);
        } else {
            /*入力が要件通りか判断し、文字列を格納する*/
            display_text = parse(display_text, class_name);
            $(".display").text(display_text);
        }
    });
});