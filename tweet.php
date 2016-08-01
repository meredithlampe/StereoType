    <?php

        //authenticate
        require_once ('codebird-php-develop/src/codebird.php');
        \Codebird\Codebird::setConsumerKey('L9lgozTjiY4RZHfpHG5ucLogP', 'h15MrqDDVFsl3S9adLOGKRNznJDeWEJASZFP9rXJW8Jcox5ptn'); // static, see README

        $cb = \Codebird\Codebird::getInstance();

        $reply = $cb->oauth2_token();
        $bearer_token = $reply->access_token;

        print("it works!");

    ?>