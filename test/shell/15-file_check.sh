#This is script#15
#-f file -d directory -c character special file -b block special file -r write permission -w write permission -x execute permission -s non-zero size
echo -e "Please Enter a name: \c"
read name
if [ -f $name ] 
then
	echo "This is a file."
elif [ -d $name ]
then
	echo "This is a directory."
else
	echo "This is NOT a file."
fi

if [ -s $name ]
then
	echo "File not empty"
else 
	echo "File empty"
fi

