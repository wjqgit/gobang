#This is script#29
echo -e "Please Enter a file name: \c"
read fname
if [ -z $fname ]
then
	exit
fi

#Store current terminal setting
terminal=`tty`

#Change the input stream from keyboard to file
exec < $fname

count=1

while read line 
do
	echo $count.$line
	count=`expr $count + 1`
done

exec < $terminal
