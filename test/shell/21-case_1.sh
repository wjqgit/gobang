#This is script#21
echo -e "Please Enter a character: \c"
read var
case $var in
	[a-z])
		echo "This is a lower-case alphabet."
		;;
	[A-Z])
		echo "This is a upper-case alphabet."
		;;
	[0-9])
		echo "This is a digit."
		;;
	?)
		echo "This is a sepcial symbol."
		;;
	*)
		echo "You entered more than one character."
		;;
esac

