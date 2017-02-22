#This is script#20
# OR operator
echo -e "Please Enter a lowercase character: \c"
read var
# read will append a carriage/cartridge return to var
if [ `echo $var | wc -c` -eq 2 ]
then
	if [ $var = a -o $var = e -o $var = i -o $var = o -o $var = u ] 
	then
		echo "This is a vowel."
	else
		echo "This is consonant."
	fi
else
			echo "Invalid input."
fi
