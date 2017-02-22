#This is script#9
#Arithmatic operations (Float)
#bc
#pipe operator |
a=5.10 b=7.13

c=`echo $a + $b | bc`
d=`echo $a - $b | bc`
e=`echo $a \* $b | bc`
f=`echo $a / $b | bc`

echo $c $d $e $f
