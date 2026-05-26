package mini_shop.mini_shop.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // API မဟုတ်တဲ့၊ file extension (.js, .css, .jpg) မပါတဲ့
    // URL မှန်သမျှကို index.html ဆီ forward လုပ်
    @GetMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }


    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String redirectNested() {
        return "forward:/index.html";
    }
}