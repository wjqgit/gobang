#This is script#8
#Arithmetic operations (Integer)
a=13 b=14
echo `expr $a + $b`
echo `expr $a - $b`
echo `expr $a \* $b`
echo `expr $a / $b`
echo `expr $a % $b`
#Precedence
c=7 d=7
echo `expr  $a \* $b + $c / $d`
echo `expr  $a \* \( $b + $c \) / $d `
