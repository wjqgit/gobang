#This is script#16
echo -e "Please Enter a file name: \c"
read fname
if [ -f $fname ]
then 
	if [ -w $fname ]
	then 
		echo "Please Enter text to be apended and press ctrl+d to exit."
		cat >> $fname
	else
		echo "You do NOT have permission to write $fname"
	fi
fi
		
