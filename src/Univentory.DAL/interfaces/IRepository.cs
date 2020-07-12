using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Common.uow;

namespace Univentory.DAL.interfaces
{
    public interface IRepository
    {
        IUnitOfWork UnitOfWork { get; }
    }
}
