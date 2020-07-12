using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Common.filters
{
    public class UniventoryDomainException : Exception
    {
        public UniventoryDomainException()
        { }

        public UniventoryDomainException(string message)
            : base(message)
        { }

        public UniventoryDomainException(string message, Exception innerException)
            : base(message, innerException)
        { }
    }
}
