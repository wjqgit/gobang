#This is script#12
#exit code
#if-then statement
echo "Please Enter input and output file names"
read input output
if mv $input $output
then 
echo "$input has been sucessfully renamed to $output"
fi
