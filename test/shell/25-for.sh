#This is script#25
#for loop
#asterisk means everything in current directory
for item in *
do
	if [ -f $item ]
	#if [ -d $item ]
	then 
		echo $item
	fi
done
