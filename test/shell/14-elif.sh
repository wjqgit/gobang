#This is script#14
# -lt less than -gt greater than -eq equal -ne not equal -le less than or equal -ge greater than or equal
echo -e "Please Enter a number between 10 and 20: \c"
read num
if [ $num -lt 10 ]
then
	echo "Number too small..."
elif [ $num -gt 20 ]
then
	echo "Number too large..."
else
	echo "Nice choice"
fi
