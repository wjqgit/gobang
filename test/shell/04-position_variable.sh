#This is script#4: takes file name as argument and renames it.
# Positional Parameters
#mv $1 $2
#cat $2
echo "Please ENTER new file name:"
read new_name
mv $1 $new_name
cat $new_name
