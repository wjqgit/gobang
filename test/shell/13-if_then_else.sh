#This is script#13
#if-then-else statement
echo "Please Enter input and output file names"
read input output
if mv $input $output
then 
	echo "$input has been sucessfully renamed to $output"
else
	echo "Renaming failed..."
fi

