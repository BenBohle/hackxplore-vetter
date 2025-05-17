#include <unistd.h>
#include <stdlib.h>

int main(void)
{
	sleep(30);
	write(2,"Error: Memory allocation error\n",31);
	exit(128);
}