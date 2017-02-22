#This is script#19
echo -e "Please Enter a character: \c"
read var
# read will append a carriage/cartridge return to var
if [ `echo $var | wc -c` -eq 2 ]
then
	echo "You entered a character."
else
	echo "Invalid input."
fi
