#This is script#31
echo -e "Please Enter a filename: \c"
read fname

terminal=`tty`

exec < $fname

#number of lines
nol=0
#number of words
now=0

while read line
do
	nol=`expr $nol + 1`
	set $line
	now=`expr $now + $#`
done

echo "Number of lines: $nol"
echo "Number of words: $now"

exec < $terminal

