<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Primer pagina en php - 250930</title>
</head>
<body>
    <?php
      //Declaracion de una variable de tipo string
    $nombre = "Itzel Joseline Sánchez Hernández";
    $carrera_estudia = " T.S.U. en Desarrollo de Software Multiplataforma";
    echo "<h1>Hola Mundo desde PHP! <h1>";
     # Esta linea emprime la versiom de PHP que se esta utilizando
    echo "<h2> Estas usando la version de PHP: " . phpversion() . "</h2>";
    ?>
    <hr>
    <?php
    /* Despues de asignarse un valor a la variable $nombre, podemos imprimirla en pantalla */
    echo "<h3> Mi nombre es $nombre y estudio: $carrera_estudia  </h3>";
    ?>
    <?php 
    $x = 10;
    $y = 5;
    $z = '3';
    
    echo "<h3> La suma de $x + $y es: " . ($x + $y) . "</h3>";
    echo "<h3> La suma de $x + $y + $z es: " . ($x + $y + $z) . "</h3>";
    
    function Multiplicar ($a, $b)
    {
        $resultado = $a * $b;
        echo "<h4> La multiplicacion de $a * $b es: $resultado </h4>";
        return $resultado; 
    }

    echo "<h4> La multiplicacion de 3 x 3 es: " . multiplicar(3, 3) . "</h4>";
    echo "<h4> La multiplicacion de $x x $y es: " . multiplicar($x, $y) . "</h4>";
    echo "<h4> La multiplicacion de 1250 x 325 es: " . multiplicar(1250, 325) . "</h4>";
    echo "<hr>";
    echo "<p> El resultado de la ultima multiplicacion es $resultado <p>";
    /*Static Scope - Alcance Estatico */
    function myTest()
    {
        static $w = 0;
        echo "$w <br>";
        $w++;
    }
    
    myTest();
    myTest();
    myTest();
    myTest();
    myTest();
    echo "$w";
    myTest();
    myTest();


    echo "<p> La variable <strong> nombre </strong> es de tipo: ";
    var_dump($nombre);
    echo "<p>";

    echo "<p> La variable <strong> nombre </strong> es de tipo: ";
    var_dump($carrera_estudia);
    echo "<p>";

    $fecha_nacimiento = date("2007/09/11");

    echo "<p> La variable <strong> Fecha de Nacimiento </strong> es de tipo: ";
    var_dump($fecha_nacimiento);
    echo "<p>";

    $fecha_hoy = date("Y/m/d");
    $edad_actual = $fecha_hoy - $fecha_nacimiento;
    echo "<p> La edad actual es: $edad_actual </p>";
    ?>
</body>
</html>