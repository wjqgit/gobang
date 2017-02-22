#This is script#22
echo -e "Please Enter a word: \c"
read word
case $word in
	[aeiou]* | [AEIOU]*)
		echo "The word begins with a vowel."
		;;
	[0-9]*)
		echo "The word begins with a digit."
		;;
	*[0-9])
		echo "The word ends with a digit."
		;;
	???)
		echo "This is a three letter word."
		;;
	*)
		echo "Indeed a bad choice."
		;;
esac
