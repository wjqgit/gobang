#This is script#18
echo -e "Please Enter a number between 50 and 100: \c"
read num
if [ $num -ge 50 -a  $num -le 100 ]
then
	echo "Indeed, a wise choice."
else
	echo "RE-think!"
fi

