#include <unistd.h>

int main(void)
{
	sleep(30);
	write(2,"Error: Memorry allocation error\n",31);
	exit(128);
}