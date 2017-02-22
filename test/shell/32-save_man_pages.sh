#This is script#32
for cmd in `cat commands`
do
	man $cmd >> helpfile
done
