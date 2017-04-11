<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1, user-scalable=no">

    <title>Seattle Neighborhood Map</title>
    <link href='https://fonts.googleapis.com/css?family=Oswald:700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="css/main.css">

    <!--oath stuff-->
//    <script src="oauth/oauth.min.js"></script>

    <!--<script src="http://d3js.org/d3.v3.min.js"></script>-->
    <!--<script src="https://d3js.org/topojson.v0.min.js"></script>-->
    <!--<script src="http://www.d3plus.org/js/d3.js"></script>-->
    <!--<script src="http://www.d3plus.org/js/d3plus.js"></script>-->
    <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>-->
    <!--<script type="text/javascript" src="http://polyk.ivank.net/polyk.js"></script>-->
    <script src="spinner/spin.min.js" type="text/javascript"></script>
    <script src="codebird/codebird.js" type="text/javascript"></script>
    <script src="d3/d3.v3.min.js" type="text/javascript"></script>
    <script src="d3plus/d3plus.js" type="text/javascript"></script>
    <script src="polyk/polyk.js" type="text/javascript"></script>
    <script src="jQuery/jquery-1.12.2.min.js" type="text/javascript"></script>
    <script src="topojson/topojson.v0.min.js" type="text/javascript"></script>



    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <!--<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>-->
    <!--<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>-->
    <!--<![endif]&ndash;&gt;-->

    <!--boostrap-->
    <!-- Latest compiled and minified CSS -->
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">-->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <!-- Optional theme -->
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">-->
    <link rel="stylesheet" href="bootstrap/css/bootstrap-theme.min.css" integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">
    <!-- Custom styles for this template -->
    <link href="css/jumbotron-narrow.css" rel="stylesheet">


</head>
<body>

    <!--bootstrap stuff-->
    <!-- Latest compiled and minified JavaScript -->
    <!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>-->
    <script src="bootstrap/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <div class="container">
        <div class="header clearfix">
            <nav>
                <ul class="nav nav-pills pull-right">
                    <!--<li role="presentation" class="active"><a href="#">Map</a></li>-->
                    <!--<li role="presentation"><a href="#">About</a></li>-->
                    <!--<li role="presentation"><a href="#">Contact</a></li>-->
                </ul>
            </nav>
            <h3 class="text-muted">StereoType</h3>
        </div>

        <div class="jumbotron">
            <!--map gets appended here-->
        </div>

        <!--<div class="row marketing">-->
        <!--<div class="col-lg-6">-->
        <!--<h4>Subheading</h4>-->
        <!--<p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>-->

        <!--<h4>Subheading</h4>-->
        <!--<p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>-->

        <!--<h4>Subheading</h4>-->
        <!--<p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>-->
        <!--</div>-->

        <!--<div class="col-lg-6">-->
        <!--<h4>Subheading</h4>-->
        <!--<p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>-->

        <!--<h4>Subheading</h4>-->
        <!--<p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>-->

        <!--<h4>Subheading</h4>-->
        <!--<p>Maecenas sed diam eget risus varius blandit sit amet non magna.</p>-->
        <!--</div>-->
        <!--</div>-->

        <footer class="footer">
            <p>&copy; 2016 TAT Lab, Department of Human Centered Design and Engineering, University of Washington</p>
        </footer>

        <script src="js/NeighborhoodGeolocation.js"></script>
        <script src="js/TweetProxy.js"></script>
        <script src="js/TweetUtil.js">      </script>
        <script src="js/RectangleDatabase.js"></script>
        <script src="js/GridCache.js"></script>
        <script src="js/PolygonGenerator.js"></script>
        <script src="js/NeighborhoodParser.js"></script>
        <script src="js/TextUtil.js"></script>
        <script src="js/DebugTool.js"></script>
        <script src="js/RectangleGenerator.js"></script>
        <script src="js/LoadingIndicator.js"></script>
        <script src="js/Model.js"></script>
//        <script src="js/main.js"></script>
        <script src="bundle.js"></script>

    </div> <!-- /container -->

</body>
</html>