#include <unistd.h>
#include <stdlib.h>

int main(void)
{
	char *msg = "Can't be touched\n";

	write(1,msg, 17);
	while (1)
	{
		sleep(15);
	}
	
}